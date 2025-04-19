import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { ThumbUp, Comment, Send } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Author {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface Comment {
  content: string;
  author: Author;
  createdAt: string;
}

interface Like {
  userId: string;
  name: string;
}

interface Post {
  _id: string;
  content: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

const Community: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPost,
          author: {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl,
          },
        }),
      });

      if (response.ok) {
        setNewPost('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.fullName,
        }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentInputs[postId]?.trim() || !user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentInputs[postId],
          author: {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl,
          },
        }),
      });

      if (response.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchPosts();
      }
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="start">
            <Avatar src={user?.imageUrl} />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
            >
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>

      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar src={post.author.imageUrl} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {post.author.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {post.content}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <IconButton
                onClick={() => handleLike(post._id)}
                color={post.likes.some(like => like.userId === user?.id) ? 'primary' : 'default'}
              >
                <ThumbUp />
              </IconButton>
              <Typography variant="body2">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </Typography>
            </Stack>

            {post.comments.map((comment, index) => (
              <Box key={index} sx={{ ml: 2, mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="start">
                  <Avatar src={comment.author.imageUrl} sx={{ width: 24, height: 24 }} />
                  <Box sx={{ backgroundColor: 'grey.100', p: 1, borderRadius: 1, flex: 1 }}>
                    <Typography variant="subtitle2">
                      {comment.author.name}
                    </Typography>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}

            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1}>
                <Avatar src={user?.imageUrl} sx={{ width: 32, height: 32 }} />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Write a comment..."
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({
                    ...prev,
                    [post._id]: e.target.value
                  }))}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => handleComment(post._id)}
                        disabled={!commentInputs[post._id]?.trim()}
                      >
                        <Send />
                      </IconButton>
                    ),
                  }}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Community; 
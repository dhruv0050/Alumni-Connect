import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Calendar } from "./ui/calendar"
import { useState } from "react"
import { addHours, format } from "date-fns"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: {
    _id: string;
    name: string;
    role: string;
    company: string;
  }
  onBook: (date: Date) => void
}

export default function BookingModal({ isOpen, onClose, mentor, onBook }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState<string>("")

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]

  const handleBooking = () => {
    if (date && timeSlot) {
      const [hours, minutes] = timeSlot.split(" ")[0].split(":")
      const bookingDate = new Date(date)
      bookingDate.setHours(parseInt(hours))
      bookingDate.setMinutes(parseInt(minutes))
      onBook(bookingDate)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Select Time</h3>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={timeSlot === slot ? "default" : "outline"}
                  onClick={() => setTimeSlot(slot)}
                  className="text-sm"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBooking}
            disabled={!date || !timeSlot}
          >
            Book Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
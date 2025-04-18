import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { Cross2Icon } from '@radix-ui/react-icons';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  batch: string;
  role: string;
  branch: string;
  location: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = React.useState<FilterOptions>(currentFilters);

  React.useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      batch: "all",
      role: "All Roles",
      branch: "All Branches",
      location: "All Locations"
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[400px] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">Filter Mentors</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-500" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="space-y-6">
            {/* Batch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Batch Year</label>
              <Select.Root
                value={filters.batch}
                onValueChange={(value) => setFilters({ ...filters, batch: value })}
              >
                <Select.Trigger className="w-full border rounded-lg px-4 py-2.5 text-left text-gray-900 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg border shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                    <Select.Viewport className="p-2">
                      <Select.Item value="all" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none">
                        <Select.ItemText>All Batches</Select.ItemText>
                      </Select.Item>
                      {[2016, 2017, 2018, 2019, 2020, 2021].map((year) => (
                        <Select.Item
                          key={year}
                          value={year.toString()}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{year}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <Select.Root
                value={filters.role}
                onValueChange={(value) => setFilters({ ...filters, role: value })}
              >
                <Select.Trigger className="w-full border rounded-lg px-4 py-2.5 text-left text-gray-900 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg border shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                    <Select.Viewport className="p-2">
                      <Select.Item value="All Roles" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none">
                        <Select.ItemText>All Roles</Select.ItemText>
                      </Select.Item>
                      {[
                        "Blockchain Developer",
                        "Data Engineer",
                        "DevOps Engineer",
                        "ML Engineer",
                        "AI Engineer",
                        "Product Manager",
                        "Data Analyst",
                        "Data Scientist",
                        "DSA Expert",
                        "Full Stack Developer",
                        "Backend Developer",
                        "Frontend Developer",
                        "UI/UX Designer",
                        "Cloud Architect",
                        "Security Engineer",
                        "Engineering Manager"
                      ].map((role) => (
                        <Select.Item
                          key={role}
                          value={role}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{role}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Branch</label>
              <Select.Root
                value={filters.branch}
                onValueChange={(value) => setFilters({ ...filters, branch: value })}
              >
                <Select.Trigger className="w-full border rounded-lg px-4 py-2.5 text-left text-gray-900 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg border shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                    <Select.Viewport className="p-2">
                      <Select.Item value="All Branches" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none">
                        <Select.ItemText>All Branches</Select.ItemText>
                      </Select.Item>
                      {["CSE", "ECE", "IT", "EE", "ME"].map((branch) => (
                        <Select.Item
                          key={branch}
                          value={branch}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{branch}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <Select.Root
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <Select.Trigger className="w-full border rounded-lg px-4 py-2.5 text-left text-gray-900 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg border shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                    <Select.Viewport className="p-2">
                      <Select.Item value="All Locations" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none">
                        <Select.ItemText>All Locations</Select.ItemText>
                      </Select.Item>
                      {[
                        "Delhi",
                        "Noida",
                        "Gurugram",
                        "Hyderabad",
                        "Pune",
                        "Mumbai",
                        "Bangalore"
                      ].map((location) => (
                        <Select.Item
                          key={location}
                          value={location}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{location}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          <div className="flex justify-end items-center space-x-3 pt-4 border-t">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Reset Filters
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FilterModal; 
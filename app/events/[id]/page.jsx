'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from 'axios';

export default function DetailEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false); // State to check if the user has booked the event

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/${id}`);
        setEvent(response.data);
        // Check if the user has already booked the event
        // Assuming there's a way to check if the user has booked the event
        // This can be done by checking a user-specific booking record in your database
        // For now, we'll simulate with a local state or hard-coded value
        // setIsBooked(response.data.userHasBooked); // Example
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleBookEvent = async () => {
    if (isBooked) {
      alert('You have already booked this event.');
      return;
    }

    if (event && event.eventQuantity > 0) {
      try {
        const updatedQuantity = event.eventQuantity - 1;
        await axios.patch(`${process.env.NEXT_PUBLIC_API_ROUTE}/${id}`, {
          eventQuantity: updatedQuantity,
        });
        setEvent((prevEvent) => ({
          ...prevEvent,
          eventQuantity: updatedQuantity,
        }));
        setIsBooked(true); // Set isBooked to true when the user books an event
      } catch (error) {
        console.error('Error updating ticket quantity:', error);
      }
    } else {
      alert('No tickets available');
    }
  };

  const handleCancelBooking = async () => {
    if (!isBooked) {
      alert('You have not booked this event yet.');
      return;
    }

    try {
      const updatedQuantity = event.eventQuantity + 1;
      await axios.patch(`${process.env.NEXT_PUBLIC_API_ROUTE}/${id}`, {
        eventQuantity: updatedQuantity,
      });
      setEvent((prevEvent) => ({
        ...prevEvent,
        eventQuantity: updatedQuantity,
      }));
      setIsBooked(false); // Set isBooked to false when the user cancels the booking
    } catch (error) {
      console.error('Error updating ticket quantity:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!event) {
    return <p>No event found</p>;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="bg-slate-800 px-5 py-5 rounded-2xl w-1/3 flex flex-col">
        <h1 className="text-4xl text-center mb-8">{event?.eventName}</h1>
        <p className="mb-1">Date: {new Date(event?.eventDate).toLocaleDateString('en-GB')}</p>
        <p className="mb-1">Description: {event?.eventDescription}</p>
        <p className="mb-1">Location: {event?.eventLocation}</p>
        <p className="mb-1">Price: {event?.eventPrice}</p>
        <p className="mb-5">Tickets remaining: {event?.eventQuantity}</p>
        <img src={event?.imageURL} alt={event?.eventName} className="rounded-3xl w-full object-cover mx-auto max-w-52" />

        {event.eventQuantity > 0 ? (
          <>
            {!isBooked ? (
              <Button 
                onClick={handleBookEvent}
                className="w-full mt-5 bg-slate-100/50 transform transition-transform duration-200 hover:scale-105 active:bg-green-500"
              >
                Book Event
              </Button>
            ) : (
              <Button 
                onClick={handleCancelBooking}
                className="w-full mt-5 bg-red-500 transform transition-transform duration-200 hover:scale-105 active:bg-red-700"
              >
                Cancel Booking
              </Button>
            )}
          </>
        ) : (
          <p className="text-red-500 mt-5 text-center">This event is fully booked.</p>
        )}
      </div>
    </div>
  );
}

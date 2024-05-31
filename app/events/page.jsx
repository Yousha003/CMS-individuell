"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);
  
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(process.env.NEXT_PUBLIC_API_ROUTE);
  
        const eventData = response.data.map((event) => {
          const eventDateTime = new Date(event.eventDate.seconds * 1000);
          const formattedEventDate = eventDateTime.toLocaleString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
  
          return {
            ...event,
            eventDate: formattedEventDate,
            eventDateTime // Add eventDateTime for sorting and filtering purposes
          };
        });
  
        setEvents(eventData);
        setLoading(false);
      } catch (err) {
        console.log('Error', err);
        setLoading(false);
        toast.error('Something goes wrong!!');
      }
    };
  
    useEffect(() => {
      fetchEvents();
    }, []);
  return (
    <div className="container mx-auto px-4 mb-40">
      <h2 className="text-6xl font-bold text-center font-mono py-14">
        Event List
      </h2>
      <div className="grid grid-cols-3 gap-10">
        {events.map((event) => (
          <div className="max-h-96" key={event.id}>
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="p-6 rounded-lg border-2 shadow-lg cursor-pointer pb flex flex-col gap-4"
            >
              <h1 className=" text-center uppercase font-bold text-2xl">{event.eventName}</h1>
              <img className="object-cover max-h-40 max-w-60 rounded mx-auto"
                src={event.imageURL}
                alt={event.eventName}
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-semibold">Date:</span> {event.eventDate}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-semibold">Price:</span>{event.eventPrice}
              </p>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-semibold">Location:</span>{event.eventLocation}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;

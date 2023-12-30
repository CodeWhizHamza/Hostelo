"use client";
import Loader from "@/components/common/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaDoorClosed } from "react-icons/fa6";
import { PatternFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";

interface IAnnouncement {
  description: string;
}

export default function Page() {
  const auth = useAuth();
  const [description, setDescription] = useState<string>("");

  useEffect(() => {}, []);

  if (auth === false) {
    return <>{redirect("/auth/signin")}</>;
  }

  if (auth === null) {
    return <Loader />;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="bg-white p-8 dark:bg-boxdark">
        <h1 className="text-4xl text-black mb-4 dark:text-white">
          Create Announcement
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-3 block text-black dark:text-white"
            >
              Description of your announcement
            </label>
            <textarea
              rows={6}
              placeholder="Enter description of your announcement"
              id="description"
              name="description"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              value={description}
              onChange={(e) => {
                if (e.target.value.length > 500) {
                  return;
                }
                setDescription(e.target.value);
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Create announcement
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-zinc-800">
      <div className="px-4 max-w-[1400px] mx-auto pt-16 w-full md:px-24 lg:px-8">
        <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <a
              href="/"
              aria-label="Go home"
              title="Company"
              className="inline-flex items-center"
            >
              <Image src="/whitelogo.png" width={100} height={200} alt="" />
            </a>
            <div className="mt-6 lg:max-w-sm">
              <p className="text-sm text-gray-300">
                At Lift Lock, we specialize in premium gym belts designed to
                support and enhance your training sessions. Our belts are
                crafted for durability, comfort, and performance, helping you
                lift with confidence and reach your fitness goals.
              </p>
              <p className="mt-4 text-sm text-gray-300">
                Whether you're a seasoned lifter or just starting out, trust
                Lift Lock for quality gear that stands the test of time
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-base font-bold tracking-wide text-gray-100">
              Contacts
            </p>
            <div className="flex">
              <p className="mr-1 text-gray-300">Phone:</p>
              <a
                href="tel:+919056506403"
                aria-label="Our phone"
                title="Our phone"
                className="transition-colors duration-300 text-gray-300 hover:text-gray-400"
              >
                +91 90565 06403
              </a>
            </div>
            <div className="flex">
              <p className="mr-1 text-gray-300">Email:</p>
              <a
                href="mailto:info@lorem.mail"
                aria-label="Our email"
                title="Our email"
                className="transition-colors duration-300  text-gray-300 hover:text-gray-400"
              >
                liftlockbelts@gmail.com
              </a>
            </div>
            <div>
              <span className="text-base font-bold tracking-wide text-gray-100">
                Social
              </span>
              <div className="flex items-center mt-3 space-x-3">
                <a
                  href="https://wa.me/message/3BKOF3I2XU4NA1"
                  target="_blank"
                  className="text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400"
                >
                  <Image
                    src="/footerwhatsapp.svg"
                    width={25}
                    height={25}
                    className="filter invert"
                    alt=""
                  />
                </a>
                <a
                  href="https://www.instagram.com/gymbelts.leverbelts?igsh=MXF5M3d6dHcwcm00OA=="
                  target="_blank"
                  className="text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400"
                >
                  <Image
                    src="/footerinstagram.svg"
                    width={25}
                    height={25}
                    className="filter invert"
                    alt=""
                  />
                </a>
                <a
                  href="/faq"
                  className="text-md font-semibold text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
                >
                  F.A.Q
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white block">
            <div className="text-base font-bold tracking-wide text-gray-100">
              Policies
            </div>
            <div>
              <Link href="/policies/privacy">Privacy</Link>
            </div>
            <div>
              <Link href="/policies/contact-us">Contact Us</Link>
            </div>
            <div>
              <Link href="/policies/terms-and-conditions">
                Terms and Conditions
              </Link>
            </div>
            <div>
              <Link href="/policies/refund-and-cancellations">
                Refund and Cancellations
              </Link>
            </div>
            <div>
              <Link href="/policies/shipping-policy">Shipping Policy</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
          <p className="text-sm text-gray-300">
            © Copyright 2024 Lift Lock Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

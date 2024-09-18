import React from "react";

const page = () => {
  return (
    <div className="w-[90%] mx-auto max-w-[600px] min-h-screen mb-16">
      <h1 className="text-4xl  text-center mt-10">Privacy Policy</h1>
      <p className="text-lg font-thin mt-5">
        Last Updated: 18th September, 2024
      </p>
      <p className="mt-5 text-lg font-thin">
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You. <br /> <br /> We use Your Personal data to provide and improve the
        Service. By using the Service, You agree to the collection and use of
        information in accordance with this Privacy Policy.
      </p>
      <h1 className="my-5  text-2xl ">
        Collecting and Using Your Personal Data
      </h1>
      <p className="text-lg font-thin">
        While using Our Service, We may ask You to provide Us with certain
        personally identifiable information that can be used to contact or
        identify You. Personally identifiable information may include, but is
        not limited to: <br /> <br /> <br /> Email address <br />
        <br /> First name <br />
        <br /> and last name <br />
        <br /> Phone number
        <br />
        <br /> Address, State, Province, ZIP/Postal code, <br />
        <br /> City Usage Data
      </p>
      <h1 className="my-5  text-2xl ">Use of Your Personal Data</h1>
      <p className="text-lg font-thin">
        The Company may use Personal Data for the following purposes:
      </p>
      <br />
      <p className="text-lg font-thin">
        <span className="font-semibold mr-2">
          {" "}
          To provide and maintain our Service
        </span>
        including to monitor the usage of our Service.
      </p>
      <br />
      <p className="text-lg font-thin">
        <span className="font-semibold mr-2"> To manage Your Account:</span>
        to manage Your registration as a user of the Service. The Personal Data
        You provide can give You access to different functionalities of the
        Service that are available to You as a registered user.
      </p>
      <br />
      <p className="text-lg font-thin">
        <span className="font-semibold mr-2">
          {" "}
          For the performance of a contract:
        </span>
        the development, compliance and undertaking of the purchase contract for
        the products, items or services You have purchased or of any other
        contract with Us through the Service.
      </p>
      <br />
      <p className="text-lg font-thin">
        <span className="font-semibold mr-2"> To contact You:</span>
        To contact You by email, telephone calls, SMS, or other equivalent forms
        of electronic communication, such as a mobile application's push
        notifications regarding updates or informative communications related to
        the functionalities, products or contracted services, including the
        security updates, when necessary or reasonable for their implementation
      </p>
    </div>
  );
};

export default page;

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FcFaq } from "react-icons/fc";

const FAQAccordion = () => {
  const faqs = [
    {
      question: "How do I sign up for the carpooling service?",
      answer:
        "Signing up is easy! Just register with your email, set up your profile, and verify your details.",
    },
    {
      question: "How does ride matching work?",
      answer:
        "Our smart algorithm matches riders and drivers based on route similarity, timing, preferences, and availability.",
    },
    {
      question: "Can I choose who joins my ride?",
      answer:
        "Yes! If you're a driver, you get to approve or reject rider requests.",
    },
    {
      question: "Is my phone number shared with other users?",
      answer:
        "No, your phone number stays private. Calls and messages are routed through an in-app masking system for security.",
    },
    {
      question: "What happens if a driver or rider cancels at the last minute?",
      answer:
        "If a driver cancels, you’ll be notified and can find an alternative ride.",
    },
    {
      question: "Is there an emergency feature for safety?",
      answer:
        "Yes! Our SOS button lets you share your real-time location with emergency contacts.",
    },
    {
      question: "Can I split the cost of the ride?",
      answer:
        "Absolutely! The app calculates the fare per seat and allows cashless payments.",
    },
    {
      question: "What happens if I forget something in the car?",
      answer:
        "You can contact the driver via the in-app chat or report the lost item.",
    },
    {
      question: "Do I need to pay in advance?",
      answer:
        "Payment depends on the driver’s preference. Some rides may require an advance, while others allow pay-on-arrival.",
    },
    {
      question: "Can I schedule a ride in advance?",
      answer:
        "Yes! Both drivers and riders can schedule rides for future dates and times.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-green-50 to-green-100 text-gray-950">
      <div className="max-w-5xl mx-auto">
        {/* Section Title with Icon */}
        <h2 className="text-3xl font-bold text-blue-800 text-left mb-8 flex items-center space-x-3">
          <FcFaq className="text-4xl" />
          <span>Got Questions? We’ve Got Answers!</span>
        </h2>

        {/* FAQ List - Single Column */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-l-4 border-blue-400 bg-white shadow-lg rounded-lg transition-all hover:shadow-xl"
              >
                {/* FAQ Question */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-4 font-semibold text-blue-900 hover:bg-blue-100 transition"
                >
                  {faq.question}
                  {isOpen ? (
                    <FaChevronUp className="text-blue-500" />
                  ) : (
                    <FaChevronDown className="text-blue-500" />
                  )}
                </button>

                {/* FAQ Answer */}
                {isOpen && (
                  <div className="p-4 text-blue-700 text-sm border-t border-blue-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;

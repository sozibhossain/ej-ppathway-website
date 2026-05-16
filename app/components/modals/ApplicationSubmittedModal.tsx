"use client";

import Link from "next/link";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { CheckIcon, ClockIcon } from "../ui/Icons";

export function ApplicationSubmittedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-5 sm:p-8 text-center">
        <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-500 inline-flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <CheckIcon size={32} />
        </div>

        <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-slate-900">Thank You for Applying!</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Your application has been successfully submitted and is now under review by our team. If your application matches our current advisor requirements, we&apos;ll contact you regarding the next stage of the interview process.
        </p>

        <div className="mt-6 bg-slate-50 rounded-xl p-4 text-left">
          <div className="text-sm font-semibold text-slate-800 mb-3">Application Progress</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-5 w-5 rounded-full bg-emerald-500 text-white items-center justify-center"><CheckIcon size={12} /></span>
            <span className="text-emerald-600 font-medium">Application Submitted</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="inline-flex h-5 w-5 rounded-full bg-amber-500 text-white items-center justify-center"><ClockIcon size={12} /></span>
            <span className="text-amber-600 font-medium">Review in Progress</span>
          </div>
        </div>

        <div className="mt-4 bg-[#f0f9fb] rounded-xl p-3 text-xs sm:text-sm text-[#0e7490] inline-flex items-center gap-2 max-w-full">
          <ClockIcon size={16} />
          Estimated Review Time: 3-5 business days
        </div>

        <p className="mt-4 text-sm text-slate-700">
          <b>Note:</b> Please monitor your email and dashboard for updates regarding your application status.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <Button variant="white" size="md" onClick={onClose}>Back to Home</Button>
          <Link href="/login" className="inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold bg-[#0e7490] text-white hover:bg-[#085a72] text-center">
            Go to Application Dashboard
          </Link>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Questions about your application? <Link href="/contact" className="text-[#0e7490] hover:underline font-medium">Contact our team</Link>
        </div>
      </div>
    </Modal>
  );
}

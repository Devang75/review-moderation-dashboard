import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { RejectFormValues } from '../types';
import { rejectValidationSchema } from '../validations/reviewFormSchema';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RejectFormValues) => Promise<void>;
}

export default function RejectModal({ isOpen, onClose, onSubmit }: RejectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#070a12]/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-bg-modal border border-white/8 rounded-[20px] w-full max-w-[450px] p-8 shadow-2xl relative animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Reject Review</h2>
          <button
            className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
            onClick={onClose}
          >✕</button>
        </div>

        <Formik
          initialValues={{ reason: '' }}
          validationSchema={rejectValidationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Reason for Rejection</label>
                <Field
                  as="textarea"
                  name="reason"
                  className="w-full bg-white/3 border border-white/8 rounded-lg py-3 px-4 text-white text-[15px] transition-all duration-200 outline-none focus:border-red-500 focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] min-h-[100px] resize-y"
                  placeholder="Provide a reason for rejecting this review..."
                />
                <ErrorMessage name="reason" component="span" className="text-red-500 text-xs mt-1.5 block" />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10"
                  onClick={onClose}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] border-none disabled:opacity-50"
                >Reject Review</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

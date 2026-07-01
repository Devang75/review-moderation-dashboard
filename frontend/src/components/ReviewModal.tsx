import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { ReviewFormValues } from '../types';
import { reviewValidationSchema } from '../validations/reviewFormSchema';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  initialValues: ReviewFormValues;
}

const defaultValues: ReviewFormValues = {
  productId: '',
  author: '',
  rating: '',
  text: '',
};

export default function ReviewModal({ isOpen, onClose, onSubmit, initialValues }: ReviewModalProps) {
  if (!isOpen) return null;

  const isEditing = !!initialValues.productId;

  return (
    <div className="fixed inset-0 bg-[#070a12]/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-bg-modal border border-white/8 rounded-[20px] w-full max-w-[500px] p-8 shadow-2xl relative animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Review' : 'Add New Review'}
          </h2>
          <button
            className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
            onClick={onClose}
          >✕</button>
        </div>

        <Formik
          initialValues={initialValues.productId ? initialValues : defaultValues}
          validationSchema={reviewValidationSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await onSubmit(values);
            } catch (err) {
              if (err && typeof err === 'object' && 'errors' in err) {
                const payload = err as { errors?: { field?: string; message: string }[] };
                if (payload.errors) {
                  payload.errors.forEach((ve) => {
                    if (ve.field) setFieldError(ve.field, ve.message);
                  });
                }
              }
            }
          }}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Product ID</label>
                <Field
                  type="text"
                  name="productId"
                  className="w-full bg-white/3 border border-white/8 rounded-lg py-3 px-4 text-white text-[15px] transition-all duration-200 outline-none focus:border-brand-primary focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
                  placeholder="e.g. sku-12"
                />
                <ErrorMessage name="productId" component="span" className="text-red-500 text-xs mt-1.5 block" />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Author</label>
                <Field
                  type="text"
                  name="author"
                  className="w-full bg-white/3 border border-white/8 rounded-lg py-3 px-4 text-white text-[15px] transition-all duration-200 outline-none focus:border-brand-primary focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
                  placeholder="e.g. user@example.com"
                />
                <ErrorMessage name="author" component="span" className="text-red-500 text-xs mt-1.5 block" />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Rating (1-5)</label>
                <Field
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  name="rating"
                  className="w-full bg-white/3 border border-white/8 rounded-lg py-3 px-4 text-white text-[15px] transition-all duration-200 outline-none focus:border-brand-primary focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
                  placeholder="e.g. 4"
                />
                <ErrorMessage name="rating" component="span" className="text-red-500 text-xs mt-1.5 block" />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Review Text</label>
                <Field
                  as="textarea"
                  name="text"
                  className="w-full bg-white/3 border border-white/8 rounded-lg py-3 px-4 text-white text-[15px] transition-all duration-200 outline-none focus:border-brand-primary focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] min-h-[100px] resize-y"
                  placeholder="Write your review..."
                />
                <ErrorMessage name="text" component="span" className="text-red-500 text-xs mt-1.5 block" />
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 bg-gradient-to-br from-brand-primary to-[#7c3aed] text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] disabled:opacity-50"
                >{isEditing ? 'Save Changes' : 'Create Review'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

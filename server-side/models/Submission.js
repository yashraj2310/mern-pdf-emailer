import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    customId: { type: String },
    submissionDate: { type: Date },
    systemTimestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', SubmissionSchema);

export default Submission;
const mongoose = require('mongoose');

const STATUS = ['EvalPending', 'EvalCompleted', 'EvalFailed'];

let schema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  context: {},
  stages: [],
  payload: {},
  status: { type: String },
  statusMessage: { type: String },
  updatedOn: { type: Date, required: true, default: Date.now, index: true },
}, {collection: 'jobs'} );

module.exports = mongoose.model("jobs", schema);

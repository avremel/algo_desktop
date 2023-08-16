const mongoose = require("mongoose");
const commentSchema = require("./comment").schema;
const schemaCleaner = require("../utils/schemaCleaner");

const answerSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    trim: true,
  },

  lang: {
    type: String,
    trim: true,
  },
  memory: {
    type: Number,
  },
  memory_percentile: {
    type: Number,
  },
  runtime_percentile: {
    type: Number,
  },
  total_correct: {
    type: Number,
  },
  total_testcases: {
    type: Number,
  },
  status_memory: {
    type: String,
    trim: true,
  },
  status_runtime: {
    type: String,
    trim: true,
  },
  theme: {
    type: String,
    trim: true,
  },
  algo: {
    type: String,
    trim: true,
  },
  answerDescription: {
    type: String,
    trim: true,
  },

  comments: [commentSchema],
  points: {
    type: Number,
    default: 0,
  },
  upvotedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schemaCleaner(answerSchema);

module.exports = mongoose.model("Answer", answerSchema);

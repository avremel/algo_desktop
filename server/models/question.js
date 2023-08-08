const mongoose = require("mongoose");
const commentSchema = require("./comment").schema;
const answerSchema = require("./answer").schema;
const schemaCleaner = require("../utils/schemaCleaner");

const answerCaseSchema = new mongoose.Schema({
  arr: String,
  target: String,
  expected: String,
});

const languageSchema = new mongoose.Schema({
  name: String,
  default_code: String,
  eval_function: String,
  answer_cases: [answerCaseSchema],
});

const questionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
  },
  question_preview: {
    type: String,
  },
  answersAuthorsArray: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  team: {
    type: String,
  },
  tags: [{ type: String, required: true, trim: true }],
  languages: [languageSchema],
  comments: [commentSchema],
  answers: [answerSchema],
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
  views: { type: Number, default: 0 },
  hotAlgo: { type: Number, default: Date.now },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schemaCleaner(questionSchema);

module.exports = mongoose.model("Question", questionSchema);

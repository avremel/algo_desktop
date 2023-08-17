const { UserInputError, AuthenticationError } = require("apollo-server");
const Question = require("../../models/question");
const User = require("../../models/user");
const authChecker = require("../../utils/authChecker");
const errorHandler = require("../../utils/errorHandler");
const { upvoteIt, downvoteIt, ansRep } = require("../../utils/helperFuncs");

module.exports = {
  Mutation: {
    postAnswer: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const {
        quesId,
        code,
        theme,
        algo,
        answerDescription,
        lang,
        memory,
        memory_percentile,
        runtime_percentile,
        total_correct,
        total_testcases,
        status_memory,
        status_runtime,
      } = args;

      try {
        const author = await User.findById(loggedUser.id);
        const question = await Question.findById(quesId);
        if (!question) {
          throw new UserInputError(
            `Question with ID: ${quesId} does not exist in DB.`
          );
        }
        question.answers.push({
          code,
          theme,
          author: author._id,
          algo,
          answerDescription,
          lang,
          memory,
          memory_percentile,
          runtime_percentile,
          total_correct,
          total_testcases,
          status_memory,
          status_runtime,
        });
        const savedQues = await question.save();
        const populatedQues = await savedQues
          .populate("answers.author", "username fullName")
          .populate("answers.comments.author", "username fullName")
          .execPopulate();

        author.answers.push({
          ansId: savedQues.answers[savedQues.answers.length - 1]._id,
        });
        await author.save();

        return populatedQues.answers;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    deleteAnswer: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { quesId, ansId } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const question = await Question.findById(quesId);
        if (!question) {
          throw new UserInputError(
            `Question with ID: ${quesId} does not exist in DB.`
          );
        }

        const targetAnswer = question.answers.find(
          (a) => a._id.toString() === ansId
        );

        if (!targetAnswer) {
          throw new UserInputError(
            `Answer with ID: '${ansId}' does not exist in DB.`
          );
        }

        if (
          targetAnswer.author.toString() !== user._id.toString() &&
          user.role !== "admin"
        ) {
          throw new AuthenticationError("Access is denied.");
        }

        question.answers = question.answers.filter(
          (a) => a._id.toString() !== ansId
        );
        await question.save();
        return ansId;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    editAnswer: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const {
        quesId,
        ansId,
        code,
        theme,
        algo,
        answerDescription,
        lang,
        memory,
        memory_percentile,
        runtime_percentile,
        total_correct,
        total_testcases,
        status_memory,
        status_runtime,
      } = args;

      try {
        const question = await Question.findById(quesId);
        if (!question) {
          throw new UserInputError(
            `Question with ID: ${quesId} does not exist in DB.`
          );
        }

        const targetAnswer = question.answers.find(
          (a) => a._id.toString() === ansId
        );

        if (!targetAnswer) {
          throw new UserInputError(
            `Answer with ID: '${ansId}' does not exist in DB.`
          );
        }

        if (targetAnswer.author.toString() !== loggedUser.id.toString()) {
          throw new AuthenticationError("Access is denied.");
        }

        if (code !== undefined) {
          targetAnswer.code = code;
        }
        if (lang !== undefined) {
          targetAnswer.lang = lang;
        }
        if (memory !== undefined) {
          targetAnswer.memory = memory;
        }
        if (memory_percentile !== undefined) {
          targetAnswer.memory_percentile = memory_percentile;
        }
        if (runtime_percentile !== undefined) {
          targetAnswer.runtime_percentile = runtime_percentile;
        }
        if (total_correct !== undefined) {
          targetAnswer.total_correct = total_correct;
        }
        if (total_testcases !== undefined) {
          targetAnswer.total_testcases = total_testcases;
        }
        if (status_memory !== undefined) {
          targetAnswer.status_memory = status_memory;
        }
        if (status_runtime !== undefined) {
          targetAnswer.status_runtime = status_runtime;
        }

        if (theme !== undefined) {
          targetAnswer.theme = theme;
        }
        if (algo !== undefined) {
          targetAnswer.algo = algo;
        }
        if (answerDescription !== undefined) {
          targetAnswer.answerDescription = answerDescription;
        }

        targetAnswer.updatedAt = Date.now();

        question.answers = question.answers.map((a) =>
          a._id.toString() !== ansId ? a : targetAnswer
        );

        const savedQues = await question.save();
        const populatedQues = await savedQues
          .populate("answers.author", "username fullName")
          .populate("answers.comments.author", "username fullName")
          .execPopulate();

        return populatedQues.answers;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },

    voteAnswer: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { quesId, ansId, voteType } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const question = await Question.findById(quesId);
        if (!question) {
          throw new UserInputError(
            `Question with ID: ${quesId} does not exist in DB.`
          );
        }

        const targetAnswer = question.answers.find(
          (a) => a._id.toString() === ansId
        );

        if (!targetAnswer) {
          throw new UserInputError(
            `Answer with ID: '${ansId}' does not exist in DB.`
          );
        }

        if (targetAnswer.author.toString() === user._id.toString()) {
          throw new UserInputError("You can't vote for your own post.");
        }

        let votedAns;
        if (voteType === "upvote") {
          votedAns = upvoteIt(targetAnswer, user);
        } else {
          votedAns = downvoteIt(targetAnswer, user);
        }

        question.answers = question.answers.map((a) =>
          a._id.toString() !== ansId ? a : votedAns
        );

        const savedQues = await question.save();
        const populatedQues = await savedQues
          .populate("answers.author", "username fullName")
          .populate("answers.comments.author", "username fullName")
          .execPopulate();

        const author = await User.findById(targetAnswer.author);
        const addedRepAuthor = ansRep(targetAnswer, author);
        await addedRepAuthor.save();

        return populatedQues.answers.find((a) => a._id.toString() === ansId);
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    acceptAnswer: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { quesId, ansId } = args;

      try {
        const question = await Question.findById(quesId);
        if (!question) {
          throw new UserInputError(
            `Question with ID: ${quesId} does not exist in DB.`
          );
        }

        const targetAnswer = question.answers.find(
          (a) => a._id.toString() === ansId
        );

        if (!targetAnswer) {
          throw new UserInputError(
            `Answer with ID: '${ansId}' does not exist in DB.`
          );
        }

        if (question.author.toString() !== loggedUser.id.toString()) {
          throw new UserInputError(
            "Only the author of question can accept answers."
          );
        }

        if (
          !question.acceptedAnswer ||
          !question.acceptedAnswer.equals(targetAnswer._id)
        ) {
          question.acceptedAnswer = targetAnswer._id;
        } else {
          question.acceptedAnswer = null;
        }

        const savedQues = await question.save();
        const populatedQues = await savedQues
          .populate("answers.author", "username fullName")
          .populate("answers.comments.author", "username fullName")
          .execPopulate();

        return populatedQues;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};

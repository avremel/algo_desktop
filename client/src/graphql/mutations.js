import { gql } from "@apollo/client";
import {
  QUESTION_DETAILS,
  LOGGED_USER_DETAILS,
  COMMENT_DETAILS,
  ANSWER_DETAILS,
} from "./fragments";

export const REGISTER_USER = gql`
  mutation registerUser(
    $email: String!
    $username: String!
    $fullName: String!
    $password: String!
  ) {
    register(
      email: $email
      username: $username
      fullName: $fullName
      password: $password
    ) {
      ...LoggedUserDetails
    }
  }
  ${LOGGED_USER_DETAILS}
`;

export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...LoggedUserDetails
    }
  }
  ${LOGGED_USER_DETAILS}
`;

export const POST_QUESTION = gql`
  mutation addQuestion(
    $title: String!
    $url: String
    $start_time: DateTime
    $end_time: DateTime
    $slug: String
    $team: String
    $tags: [String!]!
  ) {
    postQuestion(
      title: $title
      url: $url
      start_time: $start_time
      end_time: $end_time
      slug: $slug
      team: $team
      tags: $tags
    ) {
      ...QuestionDetails
    }
  }
  ${QUESTION_DETAILS}
`;
export const EDIT_QUESTION = gql`
  mutation updateQuestion(
    $quesId: ID!
    $title: String!
    $url: String
    $start_time: DateTime
    $end_time: DateTime
    $slug: String
    $team: String
    $tags: [String!]!
  ) {
    editQuestion(
      quesId: $quesId
      title: $title
      url: $url
      start_time: $start_time
      end_time: $end_time
      slug: $slug
      team: $team
      tags: $tags
    ) {
      ...QuestionDetails
    }
  }
  ${QUESTION_DETAILS}
`;

export const DELETE_QUESTION = gql`
  mutation removeQuestion($quesId: ID!) {
    deleteQuestion(quesId: $quesId)
  }
`;

export const VOTE_QUESTION = gql`
  mutation submitVote($quesId: ID!, $voteType: VoteType!) {
    voteQuestion(quesId: $quesId, voteType: $voteType) {
      id
      upvotedBy
      downvotedBy
      points
    }
  }
`;

export const ADD_QUES_COMMENT = gql`
  mutation postQuesComment($quesId: ID!, $body: String!) {
    addQuesComment(quesId: $quesId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const EDIT_QUES_COMMENT = gql`
  mutation updateQuesComment($quesId: ID!, $commentId: ID!, $body: String!) {
    editQuesComment(quesId: $quesId, commentId: $commentId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const DELETE_QUES_COMMENT = gql`
  mutation removeQuesComment($quesId: ID!, $commentId: ID!) {
    deleteQuesComment(quesId: $quesId, commentId: $commentId)
  }
`;

export const POST_ANSWER = gql`
  mutation addAnswer(
    $quesId: ID!
    $algo: String
    $answerDescription: String
    $code: String
    $theme: String
    $lang: String
    $memory: Int
    $memory_percentile: Float
    $runtime_percentile: Float
    $total_correct: Int
    $total_testcases: Int
    $status_memory: String
    $status_runtime: String
  ) {
    postAnswer(
      quesId: $quesId
      algo: $algo
      answerDescription: $answerDescription
      code: $code
      theme: $theme
      lang: $lang
      memory: $memory
      memory_percentile: $memory_percentile
      runtime_percentile: $runtime_percentile
      total_correct: $total_correct
      total_testcases: $total_testcases
      status_memory: $status_memory
      status_runtime: $status_runtime
    ) {
      ...AnswerDetails
    }
  }
  ${ANSWER_DETAILS}
`;

export const EDIT_ANSWER = gql`
  mutation updateAnswer(
    $quesId: ID!
    $ansId: ID!
    $algo: String
    $answerDescription: String
    $code: String
    $theme: String
    $lang: String
    $memory: Int
    $memory_percentile: Float
    $runtime_percentile: Float
    $total_correct: Int
    $total_testcases: Int
    $status_memory: String
    $status_runtime: String
  ) {
    editAnswer(
      quesId: $quesId
      ansId: $ansId
      algo: $algo
      answerDescription: $answerDescription
      code: $code
      theme: $theme
      lang: $lang
      memory: $memory
      memory_percentile: $memory_percentile
      runtime_percentile: $runtime_percentile
      total_correct: $total_correct
      total_testcases: $total_testcases
      status_memory: $status_memory
      status_runtime: $status_runtime
    ) {
      ...AnswerDetails
    }
  }
  ${ANSWER_DETAILS}
`;

export const DELETE_ANSWER = gql`
  mutation removeAnswer($quesId: ID!, $ansId: ID!) {
    deleteAnswer(quesId: $quesId, ansId: $ansId)
  }
`;

export const VOTE_ANSWER = gql`
  mutation submitVote($quesId: ID!, $ansId: ID!, $voteType: VoteType!) {
    voteAnswer(quesId: $quesId, ansId: $ansId, voteType: $voteType) {
      id
      upvotedBy
      downvotedBy
      points
    }
  }
`;

export const ACCEPT_ANSWER = gql`
  mutation submitAcceptAns($quesId: ID!, $ansId: ID!) {
    acceptAnswer(quesId: $quesId, ansId: $ansId) {
      id
      acceptedAnswer
    }
  }
`;

export const ADD_ANS_COMMENT = gql`
  mutation postAnsComment($quesId: ID!, $ansId: ID!, $body: String!) {
    addAnsComment(quesId: $quesId, ansId: $ansId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const EDIT_ANS_COMMENT = gql`
  mutation updateAnsComment(
    $quesId: ID!
    $ansId: ID!
    $commentId: ID!
    $body: String!
  ) {
    editAnsComment(
      quesId: $quesId
      ansId: $ansId
      commentId: $commentId
      body: $body
    ) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const DELETE_ANS_COMMENT = gql`
  mutation removeAnsComment($quesId: ID!, $ansId: ID!, $commentId: ID!) {
    deleteAnsComment(quesId: $quesId, ansId: $ansId, commentId: $commentId)
  }
`;

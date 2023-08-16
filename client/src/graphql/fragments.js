import { gql } from "@apollo/client";

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    username
    fullName
  }
`;

export const COMMENT_DETAILS = gql`
  fragment CommentDetails on Comment {
    id
    author {
      ...AuthorDetails
    }
    body
    createdAt
    updatedAt
  }
  ${AUTHOR_DETAILS}
`;

export const ANSWER_DETAILS = gql`
  fragment AnswerDetails on Answer {
    id
    author {
      ...AuthorDetails
    }
    code
    theme
    algo
    memory
    lang
    memory_percentile
    runtime_percentile
    total_correct
    total_testcases
    status_memory
    status_runtime
    answerDescription
    comments {
      ...CommentDetails
    }
    points
    upvotedBy
    downvotedBy
    createdAt
    updatedAt
  }
  ${COMMENT_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const QUESTION_DETAILS = gql`
  fragment QuestionDetails on Question {
    id
    author {
      ...AuthorDetails
    }
    title
    tags
    points
    views
    acceptedAnswer
    comments {
      ...CommentDetails
    }
    answers {
      ...AnswerDetails
    }
    upvotedBy
    downvotedBy
    createdAt
    updatedAt
    url
    start_time
    end_time
    slug
    team
  }
  ${COMMENT_DETAILS}
  ${AUTHOR_DETAILS}
  ${ANSWER_DETAILS}
`;

export const LOGGED_USER_DETAILS = gql`
  fragment LoggedUserDetails on LoggedUser {
    id
    username
    fullName
    role
    token
  }
`;

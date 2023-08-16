import { Link as RouterLink } from "react-router-dom";
import { formatDateAgo, formatDayTime } from "../utils/helperFuncs";
import { Typography, Link, Avatar } from "@material-ui/core";
import { useQuesCardStyles } from "../styles/muiStyles";
import SofLogo from "../svg/algo-teams.svg";

const ByUser = ({
  username,
  fullName,
  userId,
  createdAt,
  updatedAt,
  filledVariant,
  isAnswer,
}) => {
  const classes = useQuesCardStyles();

  return (
    <div
      className={filledVariant ? classes.filledByUser : classes.byUserWrapper}
    >
      <Avatar
        src={
          userId === "64dcfc269667b01df4b8ee48"
            ? "https://avatars.slack-edge.com/2020-03-11/984159684801_4419b0808bf45a78380e_88.png"
            : `https://secure.gravatar.com/avatar/${userId}?s=164&d=identicon`
        }
        alt={username}
        className={filledVariant ? classes.quesAnsAvatar : classes.homeAvatar}
        component={RouterLink}
        to={`/user/${username}`}
      />
      <div>
        <Typography variant="caption" color="secondary">
          {filledVariant
            ? `${isAnswer ? "answered" : "asked"} ${formatDayTime(createdAt)}`
            : `asked ${formatDateAgo(createdAt)} ago`}
        </Typography>
        <br />
        {filledVariant && createdAt !== updatedAt && (
          <Typography variant="caption" color="secondary">
            {`updated ${formatDayTime(updatedAt)}`}
          </Typography>
        )}
        <Link component={RouterLink} to={`/user/${username}`}>
          <Typography variant="body2">{fullName}</Typography>
        </Link>
      </div>
    </div>
  );
};

export default ByUser;

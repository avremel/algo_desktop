import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../graphql/queries";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStateContext } from "../context/state";
import { formatDateAgo, getErrorMsg } from "../utils/helperFuncs";

import {
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Link,
} from "@material-ui/core";
import { useUsersPageStyles } from "../styles/muiStyles";
import SearchIcon from "@material-ui/icons/Search";
import SofLogo from "../svg/algo-teams.svg";

const AllUsersPage = () => {
  const { notify } = useStateContext();
  const { data, loading } = useQuery(GET_ALL_USERS, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const [filterInput, setFilterInput] = useState("");
  const classes = useUsersPageStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" color="secondary">
        Users
      </Typography>
      <TextField
        className={classes.filterInput}
        value={filterInput}
        placeholder="Filter by username"
        onChange={(e) => setFilterInput(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      {!loading && data ? (
        <div className={classes.usersWrapper}>
          {data.getAllUsers
            .filter((u) =>
              u.username.toLowerCase().includes(filterInput.toLowerCase())
            )
            .map((u) => (
              <div key={u.id} className={classes.userBox}>
                <Avatar
                  src={
                    u.id === "64d19aa1e71da54d5c7d2916"
                      ? "https://avatars.slack-edge.com/2020-03-11/984159684801_4419b0808bf45a78380e_88.png"
                      : `https://secure.gravatar.com/avatar/${u.id}?s=164&d=identicon`
                  }
                  alt={u.username}
                  className={classes.avatar}
                  component={RouterLink}
                  to={`/user/${u.username}`}
                />
                <div>
                  <Link component={RouterLink} to={`/user/${u.username}`}>
                    <Typography variant="body2">{u.fullName}</Typography>
                  </Link>
                  <Typography variant="caption">
                    created {formatDateAgo(u.createdAt)} ago
                  </Typography>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div style={{ minWidth: "100%" }}>
          <LoadingSpinner size={80} />
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;
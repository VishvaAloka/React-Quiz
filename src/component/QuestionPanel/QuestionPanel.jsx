import React, { useState, useEffect } from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fab from "@material-ui/core/Fab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import "./QuestionPanel.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 800,
    minHeight: 400,
    textAlign: "left",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fe 100%)",
    position: "relative",
    overflow: "hidden",
  },
  question: {
    color: "#333",
    fontSize: "1.8rem",
    fontWeight: 600,
    marginTop: 20,
    lineHeight: 1.4,
  },
  category: {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
    fontSize: "0.9rem",
    letterSpacing: "0.5px",
  },
  progressRoot: {
    height: 12,
    backgroundColor: lighten("#ff6c5c", 0.7),
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: 12,
    borderRadius: 20,
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  },
  difficultyContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  answerButton: {
    margin: "8px 12px 8px 0",
    borderRadius: 12,
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  nextFab: {
    position: "fixed",
    bottom: 32,
    right: 32,
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #ee5a5a, #3fc1b8)",
      transform: "scale(1.1)",
    },
  },
  scoreContainer: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
});

export default function QuestionPanel({
  question,
  nextQuestion,
  total,
  questionNo,
  progress,
  checkUserAnswer,
  maxScore,
  score,
}) {
  const [answered, setAnswered] = useState("");
  const [message, setMessage] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const [answerButtons, setAnswerButtons] = useState({});
  const classes = useStyles();

  const handleAnswer = (ans) => {
    setAnswered(ans);
    checkUserAnswer(ans);
    const isCorrect = decodeURIComponent(question["correct_answer"]) === ans;

    if (isCorrect) {
      setMessage("Correct!");
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    } else {
      setMessage("Incorrect!");
    }

    // Update button states
    const newButtonStates = {};
    const correctAnswer = decodeURIComponent(question["correct_answer"]);

    // Mark the correct answer
    newButtonStates[correctAnswer] = "correct";

    // Mark the incorrect answer if user selected wrong
    if (!isCorrect) {
      newButtonStates[ans] = "incorrect";
    }

    setAnswerButtons(newButtonStates);
  };

  const createParticles = () => {
    if (!showParticles) return null;

    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      );
    }
    return <div className="particles">{particles}</div>;
  };

  function difficultyLevelChecker() {
    const difficultyMap = {
      hard: 3,
      medium: 2,
      easy: 1,
    };

    const level = difficultyMap[question["difficulty"]] || 0;

    return (
      <div className={classes.difficultyContainer}>
        <Typography variant="body2" color="textSecondary">
          Difficulty:
        </Typography>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="star-icon animated-icon">
            {index < level ? (
              <StarIcon className="filled" style={{ color: "#ffd700" }} />
            ) : (
              <StarBorderIcon />
            )}
          </div>
        ))}
      </div>
    );
  }

  const getButtonClass = (answer) => {
    const decodedAnswer = decodeURIComponent(answer);
    let className = classes.answerButton;

    if (answerButtons[decodedAnswer] === "correct") {
      className += " correct-answer";
    } else if (answerButtons[decodedAnswer] === "incorrect") {
      className += " incorrect-answer";
    }

    return className;
  };

  const getButtonVariant = (answer) => {
    const decodedAnswer = decodeURIComponent(answer);
    return answered === decodedAnswer ? "contained" : "outlined";
  };

  const allAnswers = [
    ...question["incorrect_answers"],
    question["correct_answer"],
  ];

  return (
    <>
      <div className={classes.progressRoot + " progress-container"}>
        <LinearProgress
          className={classes.bar}
          variant="determinate"
          value={progress}
        />
      </div>

      <Card className={classes.root}>
        {createParticles()}
        <CardActionArea>
          <CardContent>
            <div className={classes.iconContainer}>
              <EmojiEventsIcon
                style={{ color: "#ffd700" }}
                className="bounce-icon"
              />
              <Typography variant="h5" component="h3">
                Question {questionNo} of {total}
              </Typography>
            </div>

            <Typography
              gutterBottom
              variant="body2"
              component="p"
              className={classes.category}
            >
              {decodeURIComponent(question["category"])}
            </Typography>

            {difficultyLevelChecker()}

            <Divider style={{ margin: "20px 0" }} />

            <Typography
              variant="body1"
              component="p"
              className={classes.question}
            >
              {decodeURIComponent(question["question"])}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions style={{ flexWrap: "wrap", padding: "8px 16px" }}>
          {allAnswers.map((answer) => (
            <Button
              key={decodeURIComponent(answer)}
              variant={getButtonVariant(answer)}
              color="primary"
              className={getButtonClass(answer)}
              onClick={() => handleAnswer(decodeURIComponent(answer))}
              disabled={answered !== ""}
            >
              {decodeURIComponent(answer)}
            </Button>
          ))}
        </CardActions>

        {answered && (
          <div className="message">
            <div className={classes.iconContainer}>
              {message === "Correct!" ? (
                <CheckCircleIcon className="message-correct" />
              ) : (
                <CancelIcon className="message-incorrect" />
              )}
              <Typography
                variant="h5"
                component="h3"
                className={
                  message === "Correct!"
                    ? "message-correct"
                    : "message-incorrect"
                }
              >
                {message}
              </Typography>
            </div>
          </div>
        )}
      </Card>

      <div className="score-wrapper">
        <div className={classes.scoreContainer}>
          <TrendingUpIcon />
          <span className="score-text">Score: {score}%</span>
        </div>
        <div className={classes.scoreContainer}>
          <EmojiEventsIcon />
          <span className="score-text">Max Score: {maxScore}%</span>
        </div>
      </div>

      <div className={classes.progressRoot + " progress-container"}>
        <LinearProgress
          className={classes.bar}
          variant="buffer"
          value={parseFloat(score)}
          valueBuffer={parseFloat(maxScore)}
        />
      </div>

      {answered !== "" && progress !== 100 && (
        <Fab
          className={classes.nextFab + " pulse"}
          onClick={() => {
            nextQuestion();
            setAnswered("");
            setMessage("");
            setAnswerButtons({});
          }}
        >
          <NavigateNextIcon />
        </Fab>
      )}
    </>
  );
}

import "./_Button.scss";

const Button = (props) => {
  return (
    <button
      type={props.type}
      className={`new-task-btn ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

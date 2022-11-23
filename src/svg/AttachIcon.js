const AttachIcon = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={props.onClick}
    >
      <path
        d="M0 7.2V0H1.6V7.2C1.6 8.52549 2.67451 9.6 4 9.6C5.32549 9.6 6.4 8.52549 6.4 7.2V2.4C6.4 1.95818 6.04182 1.6 5.6 1.6C5.15818 1.6 4.8 1.95818 4.8 2.4V8H3.2V2.4C3.2 1.07452 4.27451 0 5.6 0C6.92549 0 8 1.07452 8 2.4V7.2C8 9.40914 6.20914 11.2 4 11.2C1.79086 11.2 0 9.40914 0 7.2Z"
        fill="#038E00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.0001 0H9.6001V7.2C9.6001 10.2928 7.0929 12.8 4.0001 12.8H1.6001V21.6C1.6001 22.9254 2.67461 24 4.0001 24H20.0001C21.3255 24 22.4001 22.9254 22.4001 21.6V2.4C22.4001 1.07452 21.3255 0 20.0001 0ZM17.6001 6.4H11.2001V8H17.6001V6.4ZM17.6001 11.2H11.2001V12.8H17.6001V11.2ZM6.4001 16H17.6001V17.6H6.4001V16Z"
        fill="#038E00"
      />
    </svg>
  );
};

export default AttachIcon;

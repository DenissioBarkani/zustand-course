import type { FC } from "react";

interface IProps {
  count: number;
}

const Value: FC<IProps> = ({ count }) => {
  return <h2>{count}</h2>;
};

export default Value;

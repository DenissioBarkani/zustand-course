import type { FC } from 'react';
import Value from './value';
import { useCount } from '../store/use-counter-store';



const ValueContainer: FC = () => {
    // const value = useCounterStore((state) => state.value);
    const count = useCount()
    return (
        <div>
            <h4>Число:</h4>
            <Value count={count} />
        </div>
    );
};

export default ValueContainer;

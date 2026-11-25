import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';

// useDispatch já com o tipo da nossa store (aceita thunks).
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
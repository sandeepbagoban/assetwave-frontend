import { Navigate } from 'react-router-dom';
export default function HiddenPage() { return <Navigate to="/about" replace />; }

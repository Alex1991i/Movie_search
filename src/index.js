import { createRoot } from 'react-dom/client';

import App from './components/app/app';
import 'antd/dist/reset.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

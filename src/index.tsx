import { render } from 'react-dom';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

render(<RouterProvider router={router} />, document.getElementById('root'));

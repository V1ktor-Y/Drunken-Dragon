/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stage } from './components/Stage/Stage';
import { Sidebar } from './components/Sidebar/Sidebar';

export default function App() {
  return (
    <div className="flex h-screen w-full">
      <Stage />
      <Sidebar />
    </div>
  );
}

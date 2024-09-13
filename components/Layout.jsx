// import Sidebar from './sidebar';

// export default function Layout({ children, onSelectNote }) {
//     return (
//         <div className="container mx-auto p-5 h-screen overflow-hidden">
//             <div className="flex flex-col sm:flex-row ">
//                 {/* Sidebar */}
//                 <Sidebar onSelectNote={onSelectNote} />
//                 {/* Main content */}
//                 <div className='w-full'>
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';
import { useSession } from "next-auth/react";
import Sidebar from './sidebar';

export default function Layout({ children, onSelectNote }) {
    const { data: session, status } = useSession();
    return (
        <div className="container mx-auto h-screen overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                {session ? (
                    <div className="h-screen">
                        <Sidebar onSelectNote={onSelectNote} />
                    </div>
                ) : null}
                <div className='w-full'>
                    {children}
                </div>
            </div>
        </div>
    );
}



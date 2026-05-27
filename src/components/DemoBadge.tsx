// export const DemoBadge = () => (
//   <div className="fixed right-20 bottom-0 z-10">
//     <a
//       href="/"
//     >
//       <div className="
//         rounded-md bg-gray-900 px-3 py-2 font-semibold text-gray-100
//       "
//       >
//         <span className="text-gray-500">Demo of</span>
//         {' TalentStream AI'}
//       </div>
//     </a>
//   </div>
// );

import Link from 'next/link';

export const DemoBadge = () => {
  return (
    <Link href="/">
      Demo of TalentStream AI
    </Link>
  );
};

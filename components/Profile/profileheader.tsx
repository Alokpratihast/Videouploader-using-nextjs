import Image from "next/image";

interface Props {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  email: string;
  bio?: string;
}

export default function ProfileHeader({ coverUrl, avatarUrl, name, email, bio }: Props) {
  return (
    <div className="relative w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow">
      {/* Cover Image */}
      <div className="w-full h-48 relative">
        <Image src={coverUrl} alt="Cover" fill className="object-cover" />
      </div>

      {/* Avatar and Info */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-24 h-24 -mt-12 rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">{name}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{email}</p>
          {bio && <p className="text-sm mt-1 text-gray-500 dark:text-neutral-400">{bio}</p>}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface TeamMemberProps {
  name: string;
  image: string;
}

function TeamMember({ name, image }: TeamMemberProps) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
}

export default TeamMember;
// src/utils/profileHelper.js

export const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  const checks = [
    Boolean(user.name?.trim()),
    Boolean(user.email?.trim()),
    Boolean(user.college?.trim()),
    Boolean(user.course?.trim()),
    Boolean(user.year),
    Boolean(user.bio?.trim()),
    Boolean(user.skills && user.skills.length > 0),
    Boolean(user.github?.trim()),
    Boolean(user.linkedin?.trim()),
    Boolean(user.resume?.trim()),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};
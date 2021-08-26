import React from 'react';
import { PersonalInfo } from './PersonalInfo';
import { ProjectsInfo } from './ProjectsInfo';
import styles from './Info.module.scss';

const Info = () => {
  return (
    <div className={styles.info}>
      <h1>Personal details:</h1>
      <PersonalInfo />
      <h1>Projects details:</h1>
      <ProjectsInfo />
    </div>
  );
};

export default Info;

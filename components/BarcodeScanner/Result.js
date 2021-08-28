import React from 'react';

const Result = ({ result }) => (
  <li>
    {result.codeResult.code} [{result.codeResult.format}]
  </li>
);

export default Result;

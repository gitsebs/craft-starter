<?php

return array(
  '*' => array(
    'enableCsrfProtection' => true,
    'limitAutoSlugsToAscii' => true,
    'omitScriptNameInUrls' => true,
    'errorTemplatePrefix' => "_errors/",
    'convertFilenamesToAscii' => true,
    'testToEmailAddress' => 'me@example.com',
  ),
  'craft.dev' => array(
    'devMode' => true,
    'siteUrl' => 'http://craft.dev/',
    'environmentVariables' => array(
      'baseAssetUrl'  => 'http://craft.dev',
      'baseAssetPath' => '',
    ),
  ),
  '.domain' => array(
    'siteUrl' => '//domain',
    'environmentVariables' => array(
      'baseAssetUrl'  => '//domain/',
      'baseAssetPath' => '',
    ),
  )
);

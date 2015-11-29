<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(
  '*' => array(
    // 'enableCsrfProtection' => true,
    'limitAutoSlugsToAscii' => true,
    'omitScriptNameInUrls' => true,
    'errorTemplatePrefix' => "_errors/",
    'convertFilenamesToAscii' => true,
    'testToEmailAddress' => 'me@example.com',
  ),
  '.dev' => array(
    'devMode' => true,
    'siteUrl' => '//redefine.dev',
    'environmentVariables' => array(
      'baseAssetUrl'  => '//redefine.dev/',
      'baseAssetPath' => '',
    ),
  ),
  '.co.za' => array(
    'siteUrl' => '//redefine.co.za',
    'environmentVariables' => array(
      'baseAssetUrl'  => '//redefine.co.za/',
      'baseAssetPath' => '',
    ),
  )
);

import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { Paragraph } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import React from "react";

/*
 * What you need to do:
 *  1) read and subscribe for changes of the `Text` field
 *  2) show information (note component would work)
 *     about a number of symbols, words and reading time
 *     (https://www.npmjs.com/package/reading-time)
 *     the package is already installed
 *  3) add a button that opens the Asset List
 */

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();

  return <Paragraph>Hello Sidebar Component</Paragraph>;
};

export default Sidebar;

import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Paragraph } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { SingleLineEditor } from '@contentful/field-editor-single-line';
import React from "react";

/*
 * What you need to do:
 *  1) learn about single-line field editor implementation: https://github.com/contentful/field-editors/blob/master/packages/single-line
 *     the package is already installed
 *  2) render the single-line field editor
 *  3) add a button that opens the app in a dialog mode. When dialog closes, the returned value should be set as the value of the field
 */


const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  return <>
    <Paragraph>Hello Entry Field Component</Paragraph>;
    <SingleLineEditor
      field={sdk.field}
      locales={sdk.locales}
      isInitiallyDisabled={false}
    />
    <button onClick={() => sdk.dialogs.openCurrentApp({ shouldCloseOnOverlayClick: true })}>Open Dialog</button>
  </>
};

export default Field;

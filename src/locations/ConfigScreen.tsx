import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Flex,
  Form,
  FormControl,
  Heading,
  Paragraph,
  Subheading,
  TextInput,
} from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import camelCase from "lodash/camelCase";
import React, { useCallback, useEffect, useState } from "react";

const makeContentType = (contentTypeId: string, contentTypeName: string) => ({
  sys: {
    id: contentTypeId,
  },
  name: contentTypeName,
  displayField: "breed",
  fields: [
    {
      id: "breed",
      name: "Breed",
      required: true,
      localized: false,
      type: "Symbol",
    },
    {
      id: "text",
      name: "Text",
      required: true,
      localized: false,
      type: "Text",
    },
  ],
});

const ConfigScreen = () => {
  const sdk = useSDK<AppExtensionSDK>();
  const cma = useCMA();

  const [isInstalled, setIsInstalled] = useState(false);
  const [allContentTypesIds, setAllContentTypeIds] = useState<string[]>([]);
  const [contentTypeName, setContentTypeName] = useState(
    "App Framework Workshop"
  );

  useEffect(() => {
    (async () => {
      const [isInstalled, allContentTypes] = await Promise.all([
        sdk.app.isInstalled(),
        cma.contentType.getMany({}),
      ]);

      const allContentTypesIds = allContentTypes.items.map(
        ({ sys: { id } }) => id
      );

      setAllContentTypeIds(allContentTypesIds);
      setIsInstalled(isInstalled);

      sdk.app.setReady();
    })();
  }, [sdk, cma]);

  const installApp = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    const contentTypeId = camelCase(contentTypeName);

    if (isInstalled) {
      sdk.notifier.success("The app is already fully configured.");
      return false;
    }

    if (!contentTypeName) {
      sdk.notifier.error("Provide a name for the content type.");
      return false;
    }

    const isContentTypeIdTaken = allContentTypesIds.includes(contentTypeId);
    if (isContentTypeIdTaken) {
      sdk.notifier.error(
        `ID "${contentTypeId}" is taken. Try a different name for the content type`
      );
      return false;
    }

    let contentType = null;
    try {
      const data = makeContentType(contentTypeId, contentTypeName);
      contentType = await cma.contentType.createWithId({ contentTypeId }, data);
    } catch (error) {
      sdk.notifier.error(`Failed to create content type "${contentTypeName}"`);
      return false;
    }

    // Set the newly created content type's state to "Published"
    try {
      await cma.contentType.publish({ contentTypeId }, contentType);
    } catch (error) {
      sdk.notifier.error(`Failed to publish content type "${contentTypeName}"`);
      return false;
    }

    return {
      targetState: {
        EditorInterface: {
          ...currentState?.EditorInterface,
          [contentType.sys.id]: {
            sidebar: { position: 0 },
            controls: [
              { fieldId: contentType.fields[0].id },

            ],
          },
        },
      },
    };
  }, [
    allContentTypesIds,
    cma.contentType,
    contentTypeName,
    isInstalled,
    sdk.app,
    sdk.notifier,
  ]);

  useEffect(() => {
    sdk.app.onConfigure(installApp);
    sdk.app.onConfigurationCompleted((err) => {
      if (!err) {
        setIsInstalled(true);
      }
    });
  }, [installApp, sdk]);

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Heading>
        {isInstalled ? "Installed! " : ""} App Framework Workshop
      </Heading>
      <Paragraph>
        This app can do many things but we need to implement them first.
      </Paragraph>
      {!isInstalled && (
        <Flex flexDirection="column">
          <Subheading>Create a content type</Subheading>
          <Form>
            <FormControl isRequired>
              <FormControl.Label>Content type name</FormControl.Label>
              <TextInput
                value={contentTypeName}
                onChange={(e) => setContentTypeName(e.target.value)}
              />
              <FormControl.HelpText>
                A new content type with{" "}
                <strong>
                  <code>{camelCase(contentTypeName)}</code>
                </strong>{" "}
                ID will be created after installing this app
              </FormControl.HelpText>
            </FormControl>
          </Form>
        </Flex>
      )}
    </Flex>
  );
};

export default ConfigScreen;

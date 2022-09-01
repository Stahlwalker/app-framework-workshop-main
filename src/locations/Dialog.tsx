import { DialogExtensionSDK } from "@contentful/app-sdk";
import { Paragraph } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import React, { useEffect, useState } from "react";
import { EntityList } from '@contentful/f36-components';

/**
 * What to do:
 *  1) fetch cats' breeds using https://api.thecatapi.com/v1/breeds
 *  2) visualize all breeds as EntityList
 *  3) when user clicks on EntityList.Item return a selected value
 *  4) Highlight the breed that was previously selected (e.g. by adding "(selected)" behind its name)
 */

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>();
  sdk.window.startAutoResizer();
  const [breeds, setBreeds] = useState<any[]>();
  async function fetchBreeds() {
    const response = await fetch("https://api.thecatapi.com/v1/breeds");
    setBreeds(await response.json());
  }

  useEffect(() => {
    fetchBreeds();
  }, []);

  return <>
    <Paragraph>Hello Dialog Component</Paragraph>;
    <EntityList>
      {breeds && breeds.map(breed => <EntityList.Item key={breed.id} title={breed.name} thumbnailUrl={breed.image?.url} onClick={() => sdk.close()} />)}
    </EntityList>
  </>
};

export default Dialog;

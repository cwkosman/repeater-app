import React, { useEffect, useState } from "react";
import {
  Button,
  EditorToolbarButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@contentful/forma-36-react-components";
import tokens from "@contentful/forma-36-tokens";
import { v4 as uuid } from "uuid";

/** The Field component is the Repeater App which shows up
 * in the Contentful field.
 *
 * The Field expects and uses a `Contentful JSON field`
 */
const Field = (props) => {
  const valueNames = props.sdk.parameters.instance.valueName.split(", ");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // This ensures our app has enough space to render
    props.sdk.window.startAutoResizer();

    // Every time we change the value on the field, we update internal state
    props.sdk.field.onValueChanged((value) => {
      if (Array.isArray(value)) {
        setItems(value);
      }
    });
  });

  const createItem = (keys) => {
    const item = {
      id: uuid(),
    };
    keys.forEach((key) => {
      item[key] = "";
    });
    return item;
  };

  /** Adds another item to the list */
  const addNewItem = () => {
    props.sdk.field.setValue([...items, createItem(valueNames)]);
  };

  /** Creates an `onChange` handler for an item based on its `property`
   * @returns A function which takes an `onChange` event
   */
  const createOnChangeHandler = (item, property) => (e) => {
    const itemList = items.concat();
    const index = itemList.findIndex((i) => i.id === item.id);

    itemList.splice(index, 1, { ...item, [property]: e.target.value });

    props.sdk.field.setValue(itemList);
  };

  /** Deletes an item from the list */
  const deleteItem = (item) => {
    props.sdk.field.setValue(items.filter((i) => i.id !== item.id));
  };

  return (
    <div>
      <Table>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {valueNames.map((key) => (
                <TableCell>
                  <TextField
                    key={`${item.id}_${key}`}
                    id={`${item.id}_${key}`}
                    name={key}
                    labelText={key}
                    value={item[key]}
                    onChange={createOnChangeHandler(item, key)}
                  />
                </TableCell>
              ))}
              <TableCell align="right">
                <EditorToolbarButton
                  label="delete"
                  icon="Delete"
                  onClick={() => deleteItem(item)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        buttonType="naked"
        onClick={addNewItem}
        icon="PlusCircle"
        style={{ marginTop: tokens.spacingS }}
      >
        Add Item
      </Button>
    </div>
  );
};

export default Field;

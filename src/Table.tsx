import React, { useState, Fragment, useRef, LegacyRef, MutableRefObject } from 'react';
import {
  formatDate,
  EuiLink,
  EuiHealth,
  EuiButton,
  EuiInMemoryTable,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  Random,
  EuiTableSelectionType,
  EuiSearchBarProps,
  EuiBasicTableColumn,
  EuiInMemoryTableProps,
  useEuiTheme
} from '@elastic/eui';
import { css } from '@emotion/react';
  
import DataStore, { User } from './dataStore';


const random = new Random();

const store = new DataStore();

const noItemsFoundMsg = <p>No users match search criteria</p>;
const loadingUserMsg = <p>Loading users...</p>;

interface SelectionValue {
    selectable: (user: User) => boolean,
    selectableMessage: (selectable: boolean) => string | undefined,
    onSelectionChange: (selection: Selection) => void,
    initialSelected: User[],
}


export default function() {
  const { euiTheme } = useEuiTheme();
  
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([] as User[]);
  const [message, setMessage] = useState(
    <EuiEmptyPrompt
      title={<h3>No users</h3>}
      titleSize="xs"
      body="Looks like you don't have any users. Let's create some!"
      actions={
        <EuiButton
          size="s"
          key="loadUsers"
          onClick={() => {
            loadUsers();
          }}
        >
          Load Users
        </EuiButton>
      }
    />
  );

  const [selection, setSelection] = useState([] as User[]);
  const [error, setError] = useState("");
  const tableRef: MutableRefObject<EuiInMemoryTable<User>> = useRef({} as EuiInMemoryTable<User>);

  const loadUsers = () => {
    setMessage(<p>Loading users...</p>);
    setLoading(true);
    setUsers([]);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setMessage(noItemsFoundMsg);
      setError("");
      setUsers(store.GetUsers());
    }, random.number({ min: 0, max: 3000 }));
  };

  const loadUsersWithError = () => {
    setMessage(<p>Loading users...</p>);
    setLoading(true);
    setUsers([]);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setMessage(noItemsFoundMsg);
      setError('ouch!... again... ');
      setUsers([]);
    //   users: [];
    }, random.number({ min: 0, max: 3000 }));
  };

  const renderToolsLeft = () => {
    if (selection.length === 0) {
      return;
    }

    const onClick = () => {
      store.DeleteUsers(selection.map((user) => user.id));
      setSelection([]);
    };

    return (
      <EuiButton color="danger" iconType="trash" onClick={onClick}>
        Delete {selection.length} Users
      </EuiButton>
    );
  };

  const renderToolsRight = () => {
    return [
      <EuiButton
        key="loadUsers"
        onClick={() => {
          loadUsers();
        }}
        isDisabled={loading}
      >
        Load Users
      </EuiButton>,
      <EuiButton
        key="loadUsersError"
        onClick={() => {
          loadUsersWithError();
        }}
        isDisabled={loading}
      >
        Load Users (Error)
      </EuiButton>,
    ];
  };

  const columns: Array<EuiBasicTableColumn<User>> = [
    {
      field: 'firstName',
      name: 'First Name',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'lastName',
      name: 'Last Name',
      truncateText: true,
    },
    {
      field: 'github',
      name: 'Github',
      render: (username: string) => (
        <EuiLink href={`https://github.com/${username}`} target="_blank">
          {username}
        </EuiLink>
      ),
    },
    {
      field: 'dateOfBirth',
      name: 'Date of Birth',
      dataType: 'date',
      render: (date: Date) => formatDate(date, 'dobLong'),
      sortable: true,
    },
    {
      field: 'nationality',
      name: 'Nationality',
      render: (countryCode: string) => {
        const country = store.GetCountry(countryCode);
        return `${country.flag} ${country.name}`;
      },
    },
    {
      field: 'online',
      name: 'Online',
      dataType: 'boolean',
      render: (online: boolean) => {
        const color = online ? 'success' : 'danger';
        const label = online ? 'Online' : 'Offline';
        return <EuiHealth color={color}>{label}</EuiHealth>;
      },
      sortable: true,
    },
  ];

  const search: EuiSearchBarProps = {
    toolsLeft: renderToolsLeft(),
    toolsRight: renderToolsRight(),
    box: {
      incremental: true,
    },
    filters: [
      {
        type: 'is',
        field: 'online',
        name: 'Online',
        negatedName: 'Offline',
      },
      {
        type: 'field_value_selection',
        field: 'nationality',
        name: 'Nationality',
        multiSelect: false,
        options: store.GetCountries().map((country) => ({
          value: country.code,
          name: country.name,
          view: `${country.flag} ${country.name}`,
        })),
      },
    ],
  };

  const pagination = {
    initialPageSize: 5,
    pageSizeOptions: [3, 5, 8],
  };

  const onlineUsers = store.GetUsers().filter((user) => user.online);

  const selectionValue:  EuiTableSelectionType<User> = {
    selectable: (user: User) => user.online,
    selectableMessage: (selectable: boolean, u: User) =>
      !selectable ? 'User is currently offline' : "",
    onSelectionChange: (selection) => setSelection(selection),
    initialSelected: onlineUsers,
  };

  const onSelection = () => {
    tableRef?.current?.setSelection(onlineUsers);
  };

  return (
    <div style={{
        color: euiTheme.colors.primary,
        border: euiTheme.border.thin,
        padding: euiTheme.size.s
    }}>
        <Fragment>
        <EuiFlexGroup alignItems="center">
            <EuiFlexItem grow={false}>
            <EuiButton onClick={onSelection}>Select online users</EuiButton>
            </EuiFlexItem>
            <EuiFlexItem />
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <EuiInMemoryTable<User>
            tableCaption="Demo of EuiInMemoryTable with selection"
            ref={tableRef}
            items={users}
            itemId="id"
            error={error}
            loading={loading}
            message={message}
            columns={columns}
            search={search}
            pagination={pagination}
            sorting={true}
            selection={selectionValue}
            isSelectable={true}
        />
        </Fragment>
    </div>
  );
};
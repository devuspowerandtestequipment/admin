import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'

export const TopPageVisit = (props) => {
  return (
    <div>
        <h3>Total Page Visit</h3>
        <Table basic='very'>
            <Table.Body>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>https://www.abc.com</Table.Cell>
                <Table.Cell>90 Times</Table.Cell>
            </Table.Row>
            </Table.Body>
        </Table>
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TopPageVisit)
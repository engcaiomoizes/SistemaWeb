import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    //backgroundColor: '#E4E4E4',
    backgroundColor: '#FFF',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    display: 'flex',
    backgroundColor: '#FFF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase'
  },

  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    //margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 4,
    fontSize: 10,
  },
});

interface Props {
    data: any[];
}

// Create Document Component
const MyDocument: React.FC<Props> = ({ data }) => {
    console.log("Dados: ", data);
    return (
  <Document>
    <Page orientation='landscape' size="A4" style={styles.page}>
        <View>
            <Text style={styles.title}>Relatório de Patrimônios</Text>
            <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, {width: '10%'}]}>
                    <Text style={styles.tableCellHeader}>Nº</Text>
                </View>
                <View style={[styles.tableColHeader, {width: '15%'}]}>
                    <Text style={styles.tableCellHeader}>Tipo</Text>
                </View>
                <View style={[styles.tableColHeader, {width: '40%'}]}>
                    <Text style={styles.tableCellHeader}>Descrição</Text>
                </View>
                <View style={[styles.tableColHeader, {width: '15%'}]}>
                    <Text style={styles.tableCellHeader}>Orgão</Text>
                </View>
                <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Equipamento</Text>
                </View>
            </View>
            {data.map((item) => (
                <View style={styles.tableRow} key={item.id}>
                    <View style={[styles.tableCol, {width: '10%'}]}>
                        <Text style={styles.tableCell}>{item.num_patrimonio}</Text>
                    </View>
                    <View style={[styles.tableCol, {width: '15%'}]}>
                        <Text style={styles.tableCell}>{item.tipo_fk.nome}</Text>
                    </View>
                    <View style={[styles.tableCol, {width: '40%'}]}>
                        <Text style={styles.tableCell}>{item.descricao}</Text>
                    </View>
                    <View style={[styles.tableCol, {width: '15%'}]}>
                        <Text style={styles.tableCell}>{item.orgao_patrimonio}</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{item.local_fk.apelido ? item.local_fk.apelido : item.local_fk.nome}</Text>
                    </View>
                </View>
            ))}
            </View>
        </View>
    </Page>
  </Document>
)};

export default MyDocument;

import type { Certificate } from '../../types';
import  certificatesJson  from './certificates.json';

const certificatesData: Certificate[] = [...certificatesJson].sort((a, b) => a.order - b.order)

export default certificatesData;

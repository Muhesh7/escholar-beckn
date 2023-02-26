from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.sign import signers
from pyhanko import stamp
from pyhanko.pdf_utils import text, images
from pyhanko.sign import fields
import os
from pyhanko.sign.general import SigningError
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign.validation.settings import KeyUsageConstraints
from pyhanko.sign.validation import validate_pdf_signature
from pyhanko_certvalidator import ValidationContext
from pyhanko.sign.general import load_cert_from_pemder

from flask import Flask
from flask import request
import ipfsApi
import requests
import logging
import base64
import io

ipfs_host = os.environ.get('IPFS_HOST', 'localhost')
verification_endpoint = os.environ.get('VERIFICATION_ENDPOINT', 'http://localhost:5000')

ipfs = ipfsApi.Client(ipfs_host, 5001)

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

def intermediate_sign(email):
    signer = signers.SimpleSigner.load_pkcs12(
    pfx_file=f'{email}-p12.p12',
    passphrase=b''
    )
    signature_meta = signers.PdfSignatureMetadata(
        field_name=f'{email} Sign',
        signer_key_usage={'digital_signature'}
    )
    with open(f'{email}-in.pdf', 'rb') as inf:
        w = IncrementalPdfFileWriter(inf)
        pdf_signer = signers.PdfSigner(signature_meta, signer)
        with open(f'{email}-out.pdf', 'wb') as outf:
            pdf_signer.sign_pdf(w, output=outf)

def final_sign(cid, email):
    signer = signers.SimpleSigner.load_pkcs12(
        pfx_file=f'{email}-p12.p12',
        passphrase=b''
    )
    
    with open(f'{email}-in.pdf', 'rb') as inf:
        w = IncrementalPdfFileWriter(inf)
        fields.append_signature_field(
            w, sig_field_spec=fields.SigFieldSpec(
                f'{email} Sign', box=(300, 100, 500, 200)
            )
        )
        meta = signers.PdfSignatureMetadata(
            field_name=f'{email} Sign',
            signer_key_usage={'digital_signature'},
        )
        pdf_signer = signers.PdfSigner(
            meta, signer=signer, stamp_style=stamp.QRStampStyle(
                # the 'signer' and 'ts' parameters will be interpolated by pyHanko, if present
                stamp_text='This document is signed digitally\nSigned by: %(signer)s\nTime: %(ts)s',
                background=images.PdfImage('check.png')
            ),
        )
        with open(f'{email}-out.pdf', 'wb') as outf:
            pdf_signer.sign_pdf(w, 
            appearance_text_params={'url': verification_endpoint + f'/ipfs/{cid}'}
            ,output=outf)
    

@app.route("/sign", methods=['POST'])
def sign():
    body = request.get_json()
    # print(body)
    cid = body['cid']
    cert = body['cert']
    key = body['key']
    final = body['final']
    email = body['email']
    with open(f'{email}-cert.pem','w') as f:
        f.write(cert)
    with open(f'{email}-key.pem', 'w') as f:
        f.write(key)
    os.system(f'openssl pkcs12 -export -in {email}-cert.pem -inkey {email}-key.pem -out {email}-p12.p12 -passout pass:')
    
    res = requests.get(f'http://{ipfs_host}:8080/ipfs/'+cid)
    # write res pdf to disk
    with open(f'{email}-in.pdf', 'wb') as f:
        f.write(res.content)
    try:
        if final:
            final_sign(cid, email)
        else:
            intermediate_sign(email)
    except SigningError as e:
        logging.exception(e)
        return {'message': 'SigningError'}, 400
    except Exception as e:
        logging.exception('Error')
        return {'message': 'Internal Server Error'}, 500
    
    path = f'{email}-out.pdf'
    print(path)
    ipfs_file = ipfs.add(path, recursive=False)
    os.system(f'rm {email}-in.pdf {email}-out.pdf {email}-cert.pem {email}-key.pem {email}-p12.p12')
    return {'cid': ipfs_file['Hash']}


@app.route("/verify", methods=['POST'])
def verify_sign():
    reader = PdfFileReader(io.BytesIO(base64.b64decode(request.get_json()['data'] + '==')))
    signature = reader.embedded_signatures[0]
    root_cert = load_cert_from_pemder('../blockchain/organizations/fabric-ca/provider/ca-cert.pem')
    vc = ValidationContext(trust_roots=[root_cert])
    status = validate_pdf_signature(signature, vc, key_usage_settings=KeyUsageConstraints(key_usage={'digital_signature'}))
    return {
        'valid': status.valid,
        'trusted': status.trusted
    }

app.run(debug=True, host='0.0.0.0', port=12345)

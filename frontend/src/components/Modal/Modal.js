import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'
import Button from '../Form/Button'

export default function Modal({
  title,
  body,
  visible,
  onVisibleToggle,
  onClose,
  onSubmit,
  closeBtnText,
  submitBtnText,
  onSubmitBtnClick,
  closeBtnColor = 'secondary',
  submitBtnColor = 'success',
}) {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{body}</CModalBody>
      <CModalFooter>
        <Button title={closeBtnText} color={closeBtnColor} onClick={onClose} btnSmall />
        <Button title={submitBtnText} color={submitBtnColor} onClick={onSubmitBtnClick} btnSmall />
      </CModalFooter>
    </CModal>
  )
}

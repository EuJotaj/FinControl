package com.fincontrol.api.controllers;

import com.fincontrol.domain.models.Invoice;
import com.fincontrol.application.services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping
    public Invoice create(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    @PostMapping("/{id}/pay")
    public Invoice pay(@PathVariable java.util.UUID id) {
        return invoiceService.payInvoice(id);
    }

    @PutMapping("/{id}")
    public Invoice update(@PathVariable java.util.UUID id, @RequestBody Invoice invoice) {
        return invoiceService.updateInvoice(id, invoice);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable java.util.UUID id) {
        invoiceService.deleteInvoice(id);
    }
}

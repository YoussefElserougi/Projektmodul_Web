# Project Module Web
Team Members: Alisa Vranic, Coumba Bathily, Katharina Vaan den Bergh, Nuria Kurrle

# Automated Glassdoor Review Response System

<p align="center">
  <img src="./Screenshot%202025-12-23%20191016.png" width="800">
</p>

An **automated system for smartly responding to Glassdoor reviews**, developed for atolls, using **n8n**, **React**, and **Next.js**.

<br/>

## Project Overview

This project automates the full process of **analyzing and responding to Glassdoor reviews**.  
The goal is to help companies:

- respond quickly to new reviews  
- create consistent and professional replies  
- reduce manual HR and employer branding work  

The system combines **workflow automation (n8n)** with a **modern web interface (Next.js / React)**.

<br/>

## About XXXX

XXXX is a company that operates several online platforms in the areas of **social commerce** and **affiliate marketing**.  
Part of XXXX are well-known services such as **mydealz**, **Shoop**, and **Cuponation**, which provides coupon and discount platforms for publishers.

<br/>

## System Idea

The system works fully automated:

1. A new Glassdoor review is detected  
2. The review is analyzed (sentiment, tone, content)  
3. A suitable response is generated  
4. The response can be approved automatically or manually  
5. The response is published or sent to the HR team  

<br/>

## Architecture

```text
Glassdoor Review
       ↓
     n8n
 (Trigger & Workflow)
       ↓
Analysis & Response Generation
       ↓
 Next.js / React Frontend
       ↓
 HR / Admin Dashboard


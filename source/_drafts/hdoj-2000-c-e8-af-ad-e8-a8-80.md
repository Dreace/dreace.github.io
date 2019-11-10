---
title: HDOJ 2000-C语言
tags:
  - ACM
  - C语言
  - HDOJ
typora-root-url: ../../source/
url: 210.html
id: 210
categories:
  - ACM
date: 2017-09-27 21:28:44
---

**Problem Description**

输入三个字符后，按各字符的ASCII码从小到大的顺序输出这三个字符。

**Input**

输入数据有多组，每组占一行，有三个字符组成，之间无空格。

**Output**

对于每组输入数据，输出一行，字符中间用一个空格分开。

**Sample Input**

qwe

asd

zxc

**Sample Output**

e q w

a d s

c x z

**Author**

lcy

#include <stdio.h>
int main(){
	char chars\[3\],b;
	int i,a;
	while(scanf("%s",&chars)!=EOF){
		for(i=0;i<2;i++){
			for(a=0;a<2;a++){
				if(chars\[a\]>chars\[a+1\]){
					b=chars\[a+1\];
					chars\[a+1\]=chars\[a\];
					chars\[a\]=b;	
				}
			}
		}
		for(i=0;i<2;i++){ 
			printf("%c ",chars\[i\]);
		}
		printf("%c\\n",chars\[2\]);
	} 
}
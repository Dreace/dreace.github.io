---
title: C/C++中cin、scanf输入效率对比
tags:
  - C/C++
typora-root-url: ../../source/
url: 246.html
id: 246
categories:
  - C/C++
  - 杂项
date: 2017-12-15 11:58:02
---

C++中std::cin用起来虽然方便，但是在数据量很大的时候会很慢，以至于在比赛中运行超时。 以下是几种输入方式的比较，均使用重定向方式输入，从硬盘中读取数据。 数据量指得是6位随机整数的数量 **测试环境**

*   Windows 10 x64
*   i5-7200U @2.5GHz
*   8GB RAM
*   Dev-C++ 5.11
*   TDM-GCC 4.9.2 64-bit Release

废话不多说，直接上数据 \[table id=1 /\] 从数据来看，数据量较小时(<103)耗时并没有多大区别 当数据量逐渐增大时(>=103)时耗时差距体现出来，总体上来看cin关闭同步后输入效率最高，其次时scanf，最后才是一般的cin。这和网上得出的scanf最快的结果有点差距，还得继续研究。

* * *

下面时测试用的代码

#include <iostream>
#include <cstdio>
int number\[100000000\];
using namespace std;
int main(){
	int i=0;
	struct timeb startTime, endTime;
	//ios::sync\_with\_stdio(false);
    ftime(&startTime);
	while(cin>>number\[i++\]);
	ftime(&endTime);
	cout<<(endTime.time-startTime.time)*1000+(endTime.millitm-startTime.millitm)<<"ms"<<endl;
	return 0;
}

#include <iostream>
#include <cstdio>
int number\[100000000\];
using namespace std;
int main(){
	int i=0;
	struct timeb startTime, endTime;
	ios::sync\_with\_stdio(false);
    ftime(&startTime);
	while(scanf("%d",&number\[i++\])!=EOF);
	ftime(&endTime);
	cout<<(endTime.time-startTime.time)*1000+(endTime.millitm-startTime.millitm)<<"ms"<<endl;
	return 0;
}

#include <iostream>
#include <cstdio>
int number\[100000000\];
using namespace std;
int main(){
	int i=0;
	struct timeb startTime, endTime;
	ios::sync\_with\_stdio(false);
    ftime(&startTime);
	while(cin>>number\[i++\]);
	ftime(&endTime);
	cout<<(endTime.time-startTime.time)*1000+(endTime.millitm-startTime.millitm)<<"ms"<<endl;
	return 0;
}